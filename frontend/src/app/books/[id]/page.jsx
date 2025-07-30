"use client";
import ApiRequest from "@/utils/apiRequest";
import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { PropagateLoader } from "react-spinners";
const BookDetail = () => {
  const { id } = useParams();
  const [book, setBook] = useState({});
  const [loading, setLoading] = useState(false);
  // console.log(id);

  // console.log(book);
  const fetchBookDetails = async () => {
    try {
      setLoading(true);
      const res = await ApiRequest.get(`/book/${id}`);
      // console.log(res);
      setBook(res?.data?.data?.singleBook);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error fetching book details", error);
    }
  };
  useEffect(() => {
    fetchBookDetails();
  }, [id]);
  return (
    <div className="w-[90%] md:px-5 mx-auto mt-6 max-w-[1140px] md:h-[800px] ">
      <Link href="/books" className="text-[#454D55] md:text-xl px-2">
        Book &gt; {book.title}
      </Link>
      <div className=" bg-white border-2 rounded-xl border-[#BBD6FF] mt-4 mb-10 h-full ">
        {loading ? (
          <div className="flex items-center justify-center h-[50%]">
            <PropagateLoader color="#0eb1a6" loading={loading} size={20} />
          </div>
        ) : (
          <div className="flex flex-col h-full md:flex-row">
            {/* left div */}
            <div className=" flex w-60  flex-col gap-12 mt-4 md:mt-0 items-center md:border-r-2  border-[#BBD6FF]">
              <div className="w-4/5 mx-auto mt-6 md:mt-10">
                <Image
                  src={book.coverImage}
                  width={162}
                  height={243}
                  alt="book cover image"
                  className="w-[162px] h-[243px] "
                />
              </div>
              <div className="flex flex-col gap-4 mx-auto md:w-4/5 md:gap-9">
                <p className="text-[#0E0F0F] ">
                  <span className="font-semibold">
                    Author’s Name: <br />
                  </span>
                  {book.author}
                </p>
                <p className="text-[#0E0F0F] ">
                  <span className="font-semibold">
                    Publication: <br />
                  </span>
                  {book.publication}
                </p>
                <p className="text-[#0E0F0F] ">
                  <span className="font-semibold">
                    Edition: <br />
                  </span>
                  {book.edition}
                </p>
              </div>
            </div>
            {/* right div */}
            <div className="pb-10 md:pb-2 md:flex-1 px-4 md:px-0">
              <h1 className="text-[#0E0F0F] font-bold italic text-3xl md:text-5xl  mt-6 md:mt-0 py-7 pl-10  border-b-2 border-[#BBD6FF] ">
                {book.title}
              </h1>
              <p
                className="md:w-[752px] md:h-[408px] pt-9 text-sm md:pl-10 overflow-y-auto"
                style={{ whiteSpace: "pre-line" }}
              >
                {book.description}
              </p>
              {/* <button className="md:mt-36 mt-8 md:ml-10 mb-4 bg-[#063173] py-2 px-4 rounded-xl text-white">
              Mark as favourite
            </button> */}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default BookDetail;
