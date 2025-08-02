import { useContext, useState } from "react";
import toast from "react-hot-toast";
import { UserContext } from "../../../context/UserContext";
import AddPropertyModal from "./AddPropertyModal";

const PropertyHeroSection = ({ scrollToRecommendSection }) => {
  const { userInfo } = useContext(UserContext);
  const [showModal, setShowModal] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

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
      <div className="bg-white py-20 px-6 md:px-16 grid grid-cols-1 md:grid-cols-2 items-center gap-10">
        {/* Left Content */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
            Find Your Best Smart Real Estate
          </h1>
          <p className="text-lg text-gray-600">
            Find a home or space from our search box. Enter your specific location, property type and price range.
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

        {/* Right Content - Reference Style Image Section */}
        <div className="relative w-full flex justify-center items-center">
          <div className="relative">
            <div className="rounded-[50%] overflow-hidden shadow-xl border border-gray-200 w-[320px] h-[400px]">
              <img
                src="/images/house1.jpg"
                alt="Main Property"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Sub images on side */}
            <div className="absolute top-1/2 -translate-y-1/2 -right-28 flex flex-col gap-4">
              {["/images/house2.jpg", "/images/house3.jpg"].map((src, idx) => (
                <div
                  key={idx}
                  className="w-24 h-20 rounded-xl overflow-hidden shadow-md hover:scale-105 transition cursor-pointer"
                >
                  <img
                    src={src}
                    alt={`Sub Property ${idx + 1}`}
                    onClick={() => handleImageClick(src)}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <AddPropertyModal showModal={showModal} closeModal={closeModal} />

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

