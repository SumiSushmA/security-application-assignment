// AddPropertyModal.jsx (Fully Redesigned with Animation and Appeal)
import axios from "axios";
import { useContext, useEffect, useRef, useState } from "react";
import toast from "react-hot-toast";
import { FaCloudUploadAlt } from "react-icons/fa";
import { RxCross2 } from "react-icons/rx";
import { UserContext } from "../../../context/UserContext";

const AddPropertyModal = ({ showModal, closeModal, editBook = null }) => {
  const [formData, setFormData] = useState({
    title: "",
    genre: "",
    description: "",
    price: "",
    condition: "",
    delivery: false,
    images: [],
  });

  const { userInfo } = useContext(UserContext);

  useEffect(() => {
    if (editBook) {
      setFormData({
        title: editBook.title || "",
        genre: editBook.genre || "",
        description: editBook.description || "",
        price: editBook.price || "",
        condition: editBook.condition || "",
        delivery: editBook.delivery || false,
        images: [],
      });
    }
  }, [editBook]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (e) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFormData((prevData) => ({
        ...prevData,
        images: [...prevData.images, ...Array.from(files)],
      }));
    }
  };

  const removeImage = (index) => {
    setFormData((prevData) => ({
      ...prevData,
      images: prevData.images.filter((_, i) => i !== index),
    }));
  };

  const fileInputRef = useRef(null);
  const handleButtonClick = () => fileInputRef.current.click();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    Object.keys(formData).forEach((key) => {
      if (key !== "images") form.append(key, formData[key]);
    });
    formData.images.forEach((image) => {
      form.append("images", image);
    });

    const headers = {
      Authorization: `Bearer ${userInfo.token}`,
    };

    try {
      let response;
      if (editBook) {
        response = await axios.patch(`/api/book/update-book/${editBook._id}`, form, { headers });
        toast.success("Property updated successfully");
      } else {
        response = await axios.post("/api/book/post-book", form, { headers });
        toast.success("Property posted successfully");
      }
      setFormData({ title: "", genre: "", description: "", price: "", condition: "", delivery: false, images: [] });
      closeModal();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const genres = [
    "Apartment",
    "Room",
    "Flat",
    "House",
    "Shared Space",
    "Commercial Space",
    "Hostel",
    "Other",
  ];

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 backdrop-blur-sm z-50 flex items-center justify-center animate-fade-in">
      <div className="bg-white p-6 md:p-8 rounded-2xl shadow-2xl w-full max-w-3xl h-[90vh] overflow-y-auto animate-slide-up">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 animate-fade-in">
            {editBook ? "Edit Property" : "Post Your Property"}
          </h2>
          <button onClick={closeModal} className="text-gray-600 hover:text-red-500 text-2xl">
            &times;
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in delay-100">
          <div>
            <label className="block text-sm font-medium mb-1">Property Title</label>
            <input
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              placeholder="e.g. Cozy Flat in Kathmandu"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              rows={4}
              placeholder="Describe your property..."
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Property Type</label>
              <select
                name="genre"
                value={formData.genre}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select...</option>
                {genres.map((g, i) => (
                  <option key={i} value={g}>{g}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Furnishing</label>
              <select
                name="condition"
                value={formData.condition}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                required
              >
                <option value="">Select...</option>
                <option value="Furnished">Furnished</option>
                <option value="Semi-Furnished">Semi-Furnished</option>
                <option value="Unfurnished">Unfurnished</option>
              </select>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Price (NPR)</label>
              <input
                name="price"
                type="number"
                value={formData.price}
                onChange={handleChange}
                onKeyDown={(e) => ["-", "+", "e"].includes(e.key) && e.preventDefault()}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-400"
                placeholder="e.g. 25000"
                required
              />
            </div>
            <div className="flex items-center mt-6">
              <input
                id="delivery"
                name="delivery"
                type="checkbox"
                checked={formData.delivery}
                onChange={() => setFormData((prev) => ({ ...prev, delivery: !prev.delivery }))}
                className="mr-2"
              />
              <label htmlFor="delivery" className="text-sm">Utilities Included</label>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Upload Images</label>
            <div className="flex flex-wrap gap-3">
              {formData.images.map((image, index) => (
                <div key={index} className="relative w-24 h-24 rounded-lg overflow-hidden">
                  <img src={URL.createObjectURL(image)} className="w-full h-full object-cover" alt="Preview" />
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute top-1 right-1 bg-white text-black rounded-full p-1 shadow hover:bg-red-200"
                  >
                    <RxCross2 />
                  </button>
                </div>
              ))}
              {formData.images.length < 4 && (
                <div
                  onClick={handleButtonClick}
                  className="w-24 h-24 border-2 border-dashed border-blue-400 flex flex-col items-center justify-center text-blue-400 rounded-lg cursor-pointer hover:bg-blue-50 transition"
                >
                  <FaCloudUploadAlt className="text-xl" />
                  <p className="text-xs text-center">Upload</p>
                </div>
              )}
              <input
                type="file"
                name="images"
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-all duration-300 font-semibold text-lg shadow">
            {editBook ? "Update Property" : "Post Property"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddPropertyModal;
