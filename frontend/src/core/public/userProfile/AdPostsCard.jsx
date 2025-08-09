import axios from "axios";
import { formatDistanceToNowStrict } from "date-fns";
import { useContext, useEffect, useState } from "react";
import toast from "react-hot-toast";
import { AiOutlineDelete } from "react-icons/ai";
import { FaEdit } from "react-icons/fa";
import { LuSearch } from "react-icons/lu";
import { MdOutlineSell } from "react-icons/md";
import { Link } from "react-router-dom";
import { UserContext } from "../../../context/UserContext";
import useUserProperties from "../../../hooks/useUserProperties"; 
import AddBookModal from "../homePage/AddPropertyModal";
import notAvailable from "/BG/notAvailable.svg";

const AdPostsCard = ({ userId }) => {
  const [filteredAds, setFilteredAds] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const { allProperties, loading, fetchProperties } = useUserProperties(userId);
  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    setFilteredAds(allProperties);
  }, [allProperties]);

  const deleteAd = async (propertyId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this ad?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete("/api/book/delete-book", {
        headers: {
          bookid: propertyId,
          authorization: `Bearer ${userInfo.token}`,
        },
      });
      toast.success(response.data.message);
      const updated = allProperties.filter((p) => p._id !== propertyId);
      setFilteredAds(updated);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const markAsSold = async (propertyId) => {
    const confirm = window.confirm("Mark this property as sold?");
    if (!confirm) return;

    try {
      await axios.patch(`/api/book/mark-as-sold/${propertyId}`, {}, {
        headers: { authorization: `Bearer ${userInfo.token}` },
      });
      toast.success("Marked as sold!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark as sold");
    }
  };

  const handleSearch = (e) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = allProperties.filter((p) =>
      p.title.toLowerCase().includes(query)
    );
    setFilteredAds(filtered);
  };

  const [showModal, setShowModal] = useState(false);
  const [selectedAd, setSelectedAd] = useState(null);

  const handleEditClick = (ad) => {
    setSelectedAd(ad);
    setShowModal(true);
  };

  const closeModal = async () => {
    setShowModal(false);
    setSelectedAd(null);
    await fetchProperties();
    setFilteredAds(allProperties);
  };

  return (
    <div className="font-gilroy">
      <div className="md:w-10/12 w-11/12 py-2 border rounded-lg mt-6 flex items-center justify-between p-4">
        <input
          type="text"
          value={searchQuery}
          onChange={handleSearch}
          placeholder="Search Properties"
          className="w-full focus:outline-none"
        />
        <span className="text-2xl text-gray-600 cursor-pointer">
          <LuSearch />
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 md:gap-y-8 gap-y-5 mt-6">
        {loading ? (
          <div>Loading...</div>
        ) : filteredAds.length > 0 ? (
          filteredAds.map((property) => (
            <div
              key={property?._id}
              className="flex items-center gap-x-2 max-w-96 border rounded-lg p-3 hover:shadow-sm transition-all"
            >
              <Link>
                <img
                  src={`/api/uploads/books/${property?.images[0]}`}
                  alt={property.title}
                  className="rounded-lg lg:w-36 md:w-40 w-32 md:h-44 h-36 object-cover"
                />
              </Link>
              <div className="flex flex-col px-2 pb-2">
                <div>
                  <h1 className="font-gilroySemiBold md:text-lg">
                    {property?.title}
                  </h1>
                  <p className="md:text-xs text-[10px] text-gray-600 mt-1 mb-1">
                    {property.description.length > 50
                      ? `${property.description.substring(0, 50)}...`
                      : property.description}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 pr-2">
                  <h1 className="font-gilroySemiBold text-gray-700 md:text-lg text-sm">
                    NPR {property?.price}
                  </h1>
                  <span className="text-[10px] border-b">{property?.condition}</span>
                </div>
                <div className="flex justify-between items-center border-b md:pb-2 pb-1 mt-2 text-xs">
                  <span className="text-gray-600">
                    Posted {formatDistanceToNowStrict(new Date(property?.updatedAt))} ago
                  </span>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      property.status === "Pending"
                        ? "bg-yellow-100 text-yellow-800"
                        : property.status === "Approved"
                        ? "bg-green-100 text-green-800"
                        : property.status === "Declined"
                        ? "bg-red-100 text-red-800"
                        : ""
                    }`}
                  >
                    {property?.status}
                  </span>
                </div>
                <div className="flex justify-between mt-3 text-gray-600">
                  <button onClick={() => handleEditClick(property)} className="flex items-center hover:text-green-700">
                    <FaEdit className="md:text-lg" />
                    <span className="text-sm pl-1">Edit</span>
                  </button>
                  <button onClick={() => deleteAd(property._id)} className="flex items-center hover:text-red-700">
                    <AiOutlineDelete className="md:text-xl" />
                    <span className="text-sm">Delete</span>
                  </button>
                  <button onClick={() => markAsSold(property._id)} className="flex items-center hover:text-yellow-700">
                    <MdOutlineSell className="md:text-lg" />
                    <span className="text-sm pl-1">Sold</span>
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <img src={notAvailable} alt="No Ads" className="w-40 mb-4" />
            <h2 className="text-xl font-semibold">No Listings Found</h2>
            <p className="text-gray-500 mb-4">Post your first property now.</p>
            <button onClick={() => setShowModal(true)} className="bg-gray-800 text-white px-4 py-2 rounded-md">
              Post New Ad
            </button>
          </div>
        )}
      </div>

      <AddBookModal
        showModal={showModal}
        closeModal={closeModal}
        editBook={selectedAd}
      />
    </div>
  );
};

export default AdPostsCard;
