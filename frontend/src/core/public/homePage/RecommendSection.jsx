import { useEffect } from "react";
import useApprovedProperties from "../../../hooks/useApprovedProperties";
import PropertyCard from "./PropertyCard";

const RecommendSection = ({ activeTab, setActiveTab }) => {
  const {
    allProperties,
    filteredProperties,
    filterProperties,
    loading,
    selectedCategory,
    setSelectedCategory,
  } = useApprovedProperties();

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    filterProperties(tab);
  };

  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    filterProperties(activeTab, category);
  };

  useEffect(() => {
    filterProperties(activeTab);
  }, [activeTab]);

  // Generate unique categories from allProperties
  const categories = Array.from(new Set(["All", ...allProperties.map((item) => item.category)]));

  return (
    <div className="md:px-8 px-4 lg:mt-0 md:mt-6 mt-10 pb-20">
      <div className="flex md:flex-row flex-col gap-y-4 justify-between">
        <div>
          <button
            onClick={() => handleTabChange("Recommended")}
            className={`mr-4 md:text-xl text-lg font-ppMori ${
              activeTab === "Recommended"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-600 border-b-2 border-transparent"
            }`}
          >
            Recommended
          </button>
          <button
            onClick={() => handleTabChange("New Listings")}
            className={`md:text-xl text-lg font-ppMori ${
              activeTab === "New Listings"
                ? "text-gray-900 border-b-2 border-gray-900"
                : "text-gray-600 border-b-2 border-transparent"
            }`}
          >
            New Listings
          </button>
        </div>
        <select
          className="select select-bordered md:w-48 max-w-48 font-gilroyMedium"
          value={selectedCategory}
          onChange={handleCategoryChange}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      {loading ? (
        <div className="text-center mt-10">
          <h1 className="loading loading-infinity loading-lg"></h1>
        </div>
      ) : (
        <PropertyCard properties={filteredProperties} />
      )}
    </div>
  );
};

export default RecommendSection;
