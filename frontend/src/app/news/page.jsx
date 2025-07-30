"use client";
import { useState, useEffect } from "react";
import { PropagateLoader } from "react-spinners";
import ApiRequest from "@/utils/apiRequest";
import NewsCard from "@/components/NewsCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const News = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [news, setNews] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchNews = async (page) => {
    try {
      setIsLoading(true);
      const res = await ApiRequest.get(`/news?page=${page}&limit=3`);
      // console.log("API Response:", res);
      setNews(res?.data?.data?.news || []);
      setTotalPages(res?.data?.data?.totalPages || 1);
    } catch (error) {
      console.log("Error fetching news:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchNews(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prevPage) => prevPage - 1);
    }
  };

  // console.log("Current Page:", currentPage, "Total Pages:", totalPages);

  return (
    <div className="w-full px-5 pb-10 mx-auto md:w-4/5 mt-14 max-w-7xl md:px-10">
      {isLoading ? (
        <div className="flex items-center justify-center h-[50%]">
          <PropagateLoader color="#0eb1a6" loading={isLoading} size={20} />
        </div>
      ) : (
        <>
          <h1 className="text-[#0E0F0F] font-bold text-3xl md:text-5xl">
            News
          </h1>
          <div className="grid grid-cols-1 mt-8 space-y-36 md:mt-12 md:space-y-28">
            {/* News Cards */}
            {news?.map((item) => (
              <NewsCard key={item._id} news={item} />
            ))}
          </div>
          {/* pagination */}
          <div className="flex justify-center gap-4 pt-5 mt-20 md:mt-6">
            {currentPage > 1 && (
              <button
                onClick={handlePrevPage}
                className="flex items-center px-4 py-2 text-white bg-gray-600 rounded-md"
              >
                <IoIosArrowBack className="mr-1" /> Previous
              </button>
            )}
            <span className="mx-2 text-xl text-brown">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <button
                onClick={handleNextPage}
                className="flex items-center px-4 py-2 text-white bg-gray-600 rounded-md"
              >
                Next <IoIosArrowForward className="ml-1" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default News;
