"use client";
import { useState, useEffect } from "react";
import { PropagateLoader } from "react-spinners";
import ApiRequest from "@/utils/apiRequest";
import BookCard from "@/components/BookCard";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";

const Books = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchBooks = async (page) => {
    try {
      setLoading(true);
      const res = await ApiRequest.get(`/book?page=${page}&limit=6`);
      setBooks(res?.data?.data?.books);
      setTotalPages(res?.data?.data?.totalPages);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error while fetching books", error);
    }
  };

  useEffect(() => {
    fetchBooks(currentPage);
  }, [currentPage]);

  const handleNextPage = () => {
    setCurrentPage((prevPage) => prevPage + 1);
  };

  const handlePrevPage = () => {
    setCurrentPage((prevPage) => prevPage - 1);
  };

  return (
    <div className="w-full px-5 mx-auto mt-6 max-w-7xl md:px-16">
      {loading ? (
        <div className="flex items-center justify-center h-[50%]">
          <PropagateLoader color="#0eb1a6" loading={loading} size={20} />
        </div>
      ) : (
        <>
          <h1 className="text-[#0E0F0F] font-bold text-3xl md:text-5xl">
            quizkoshi Library
          </h1>
          <div className="grid mt-16 md:grid-cols-3 gap-x-6 gap-y-10 md:gap-y-20">
            {books.map((book) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
          <div className="flex items-center justify-center gap-4 mt-6">
            {currentPage > 1 && (
              <button
                onClick={handlePrevPage}
                className="flex items-center px-4 py-2 mr-2 text-white bg-gray-600 rounded-md">
                <IoIosArrowBack className="mr-1" /> Previous
              </button>
            )}
            <span className="mx-2 text-xl text-brown">
              Page {currentPage} of {totalPages}
            </span>
            {currentPage < totalPages && (
              <button
                onClick={handleNextPage}
                className="flex items-center px-4 py-2 text-white bg-gray-600 rounded-md">
                Next <IoIosArrowForward className="ml-1" />
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Books;
