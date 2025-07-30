"use client";

import { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { useAuth } from "@/context/userContext";
import ApiRequest from "@/utils/apiRequest";

// server side rendering false or lazy loading to escpe error
const Image = dynamic(() => import("next/image"), { ssr: false });
const DashChangePassword = dynamic(
  () => import("@/components/DashChangePassword"),
  { ssr: false }
);
const DashExamHistory = dynamic(() => import("@/components/DashExamHistory"), {
  ssr: false,
});
const DashProfile = dynamic(() => import("@/components/DashProfile"), {
  ssr: false,
});
const PropagateLoader = dynamic(
  () => import("react-spinners/PropagateLoader"),
  { ssr: false }
);

const Profile = () => {
  const { isAuthenticated, user, setUser } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [selectedImage, setSelectedImage] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        const res = await ApiRequest.get("/user/me");
        setUser(res?.data?.data?.user);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching user data:", error);
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchUserData();
    }
  }, [isAuthenticated, setUser]);

  const handleImageChange = async (event) => {
    const imageFile = event.target.files[0];
    setSelectedImage(imageFile);

    const formData = new FormData();
    formData.append("avatar", imageFile);

    try {
      setLoading(true);
      const response = await ApiRequest.patch("/user/avatar", formData);

      setUser((prevUser) => ({
        ...prevUser,
        avatar: response?.data?.data?.user?.avatar,
      }));
    } catch (error) {
      console.error("Error uploading image:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-full md:h-[736px] max-w-6xl px-5 mx-auto my-10 md:px-0">
      {loading ? (
        <div className="flex items-center justify-center h-[50%]">
          <PropagateLoader color="#0eb1a6" loading={loading} size={20} />
        </div>
      ) : (
        <div className="bg-[#F7F7F7] h-full  border-2 border-[#BBD6FF] rounded-xl flex flex-col md:flex-row">
          {/* left div */}
          <div className="w-[265px] h-full md:border-r-2 border-[#BBD6FF] pt-10 mx-auto">
            {user && (
              <div className="relative">
                <Image
                  src={user.avatar}
                  alt="profile"
                  height={129}
                  width={129}
                  className="w-[129px] h-[129px] rounded-full mx-auto object-cover"
                />

                <label
                  htmlFor="profileImageInput"
                  className="absolute transform translate-x-1/2 cursor-pointer bottom-6 right-1/2"
                >
                  <Image
                    src="/profileIcon.png"
                    alt="profile"
                    width={32}
                    height={32}
                    className="duration-300 hover:scale-110"
                  />
                </label>
                <input
                  id="profileImageInput"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                <p className="text-center text-[#0E0F0F] font-semibold pt-4">
                  {user.fullname}
                </p>
              </div>
            )}
            <div className="mt-12">
              <p
                className={`px-6 py-3 cursor-pointer border-l-4  ${
                  activeTab === "profile"
                    ? "bg-[#E5EFFF] border-[#C40031]"
                    : "border-transparent "
                } `}
                onClick={() => setActiveTab("profile")}
              >
                Profile
              </p>

              <p
                className={`px-6 py-3 cursor-pointer border-l-4  ${
                  activeTab === "changePassword"
                    ? "bg-[#E5EFFF] border-[#C40031]"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab("changePassword")}
              >
                Change Password
              </p>

              <p
                className={`px-6 py-3 cursor-pointer border-l-4  ${
                  activeTab === "exam-detail"
                    ? "bg-[#E5EFFF] border-[#C40031]"
                    : "border-transparent"
                }`}
                onClick={() => setActiveTab("exam-detail")}
              >
                Exam Details
              </p>
            </div>
          </div>
          {/* right div */}
          <div className="md:flex-1">
            <h1 className="text-[#0E0F0F] font-bold text-3xl md:text-5xl border-b-2 border-[#BBD6FF] w-full pt-10 pl-10 pb-8 tracking-wide">
              {activeTab === "profile"
                ? "Profile"
                : activeTab === "changePassword"
                ? "Change Password"
                : "Exam History"}
            </h1>
            {/* details */}
            {activeTab === "profile" && <DashProfile />}
            {activeTab === "changePassword" && <DashChangePassword />}
            {activeTab === "exam-detail" && <DashExamHistory />}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
