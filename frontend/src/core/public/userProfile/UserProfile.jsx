import { useContext, useState } from "react";
import { FaFacebookF, FaInstagram, FaLinkedinIn, FaLocationDot } from "react-icons/fa6";
import { IoLogOutOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import BottomNavBar from "../../../components/BottomNavBar";
import Navbar from "../../../components/Navbar";
import { UserContext } from "../../../context/UserContext";
import AdPostsCard from "./AdPostsCard";
import AnalyticsCard from "./AnalyticsCard";
import EditProfile from "./EditProfile";
import SaveListingsCard from "./SaveListingsCard";
import SoldCard from "./SoldCard";

const UserProfile = () => {
  const { userInfo, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("adPosts");
  const [isEditing, setIsEditing] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const tabs = [
    { id: "adPosts", label: "My Listings", component: <AdPostsCard userId={userInfo?._id} /> },
    { id: "sold", label: "Sold", component: <SoldCard /> },
    { id: "saveLists", label: "Saved", component: <SaveListingsCard /> },
    { id: "analytics", label: "Analytics", component: <AnalyticsCard /> },
  ];

  const toggleEditProfile = () => setIsEditing(!isEditing);
  const closeEditProfile = () => setIsEditing(false);

  return (
    <div className="mx-auto max-w-6xl">
      <Navbar />
      <div className="px-4 py-6 flex flex-col lg:flex-row gap-6 min-h-screen">
        {/* Profile Sidebar */}
        <div className="lg:w-1/4 w-full bg-white shadow rounded-xl p-6 space-y-4">
          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden border-4 border-gray-200">
            <img
              src={
                userInfo?.avatar
                  ? userInfo.avatar.startsWith("http")
                    ? userInfo.avatar
                    : `/api/uploads/users/${userInfo.avatar}`
                  : "/api/uploads/users/default_avatar.png"
              }
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-semibold">{userInfo?.name}</h2>
            <p className="text-sm text-gray-500">{userInfo?.email}</p>
            <div className="flex items-center justify-center text-sm text-gray-500 mt-1">
              <FaLocationDot className="mr-1" />
              {userInfo?.address || "No Address"}
            </div>
            <div className="flex justify-center gap-4 mt-3 text-gray-500">
              {userInfo?.facebook && (
                <a href={userInfo.facebook} target="_blank" rel="noopener noreferrer" className="hover:text-blue-600">
                  <FaFacebookF />
                </a>
              )}
              {userInfo?.instagram && (
                <a href={userInfo.instagram} target="_blank" rel="noopener noreferrer" className="hover:text-pink-500">
                  <FaInstagram />
                </a>
              )}
              {userInfo?.linkedin && (
                <a href={userInfo.linkedin} target="_blank" rel="noopener noreferrer" className="hover:text-blue-700">
                  <FaLinkedinIn />
                </a>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <button
              onClick={toggleEditProfile}
              className="w-full py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700"
            >
              Edit Profile
            </button>
            <button
              onClick={handleLogout}
              className="w-full py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
            >
              <div className="flex justify-center items-center gap-2">
                <IoLogOutOutline className="text-lg" /> Logout
              </div>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="lg:w-3/4 w-full space-y-4">
          {/* Tabs */}
          <div className="flex flex-wrap gap-3">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? "bg-indigo-600 text-white shadow"
                    : "bg-gray-200 text-gray-800 hover:bg-gray-300"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Edit Profile */}
          {isEditing && (
            <div className="bg-white shadow rounded-lg p-4">
              <EditProfile onClose={closeEditProfile} />
            </div>
          )}

          {/* Active Tab Content */}
          {!isEditing && (
            <div className="bg-white shadow rounded-lg p-4">
              {tabs.find((tab) => tab.id === activeTab)?.component}
            </div>
          )}
        </div>
      </div>
      <BottomNavBar />
    </div>
  );
};

export default UserProfile;
