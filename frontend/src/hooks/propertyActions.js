import axios from "axios";
import toast from "react-hot-toast";
import useConversation from "../zustand/useConverstaion";

// Save a property to favorites
export const handleSaveProperty = async (propertyId) => {
  try {
    const response = await axios.post(
      "/api/user/add-to-favorites",
      { bookId: propertyId }, // backend expects bookId, keeping it unchanged
      {
        withCredentials: true,
      }
    );
    toast.success(response.data.message);
  } catch (error) {
    if (error.response?.status === 401) {
      toast.error("Please login to save the property.");
    } else {
      toast.error(error.response?.data?.message || "Failed to save the property.");
    }
  }
};

// Initiate chat with the property owner
export const handleChatNow = async (ownerId) => {
  try {
    const res = await axios.get(`/api/user/get-user-by-id/${ownerId}`, {
      withCredentials: true,
    });
    const { setSelectedConversation } = useConversation.getState(); // Zustand
    setSelectedConversation(res.data);
    return true; // Open chat modal
  } catch (error) {
    if (error.response?.status === 401) {
      toast.error("Please login to chat with the property owner.");
    } else {
      const errorMessage = error.response?.data?.error || error.message;
      toast.error(errorMessage);
    }
    return false;
  }
};
